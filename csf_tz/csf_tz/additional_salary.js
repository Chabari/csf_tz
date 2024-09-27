frappe.ui.form.on('Additional Salary', {
	refresh: function(frm) {
		cur_frm.add_custom_button(__("Generate Additional Salary Records"), function() {
			generate_additional_salary_records();
		});
	},
	payroll_date: function(frm) {
		if (!frm.doc.payroll_date) {
			frm.set_value("no_of_hours", null);
		} else {
			get_employee_base_salary_in_hours(frm);
		}
	},
	employee: function(frm) {
		if (!frm.doc.employee) {
			frm.set_value("no_of_hours", null);
		}
	},
	salary_component: function(frm) {
		if (!frm.doc.salary_component) {
			frm.set_value("based_on_hourly_rate", null);
			frm.set_value("hourly_rate", null);
		}
	},
	no_of_hours: function(frm) {
		get_employee_base_salary_in_hours(frm);
	},
});
const generate_additional_salary_records = function(){
	frappe.call({
		method: "payware.payware.utils.generate_additional_salary_records",
		args: {},
		callback: function(){
			cur_frm.reload_doc();
		}
	});
};

const get_employee_base_salary_in_hours = (frm) => {
	if (frm.doc.no_of_hours && frm.doc.employee && frm.doc.payroll_date) {
		frappe.call({
			method: "payware.payware.utils.get_employee_base_salary_in_hours",
			args: {
				employee: frm.doc.employee,
				payroll_date: frm.doc.payroll_date
			},
			async: false,
			callback: function(r) {
				console.log(r.message)
				if(r.message) {
					frm.set_value("amount", frm.doc.hourly_rate / 100 * frm.doc.no_of_hours * r.message.base_salary_in_hours);
				}
			}
		});	
	}
}